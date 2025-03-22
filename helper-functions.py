def call_with_continuation(messages: list, model: str, website_id: str) -> str:
    """
    Helper function to handle responses that may need continuation.
    Automatically continues generating if response doesn't end with specific completion markers.
    Handles HTML code blocks efficiently by removing redundant markers.
    """
    initial_messages = copy.deepcopy(messages)  # Deep copy to prevent reference issues
    full_response = ""
    continuation_count = 0
    max_continuations = 10

    # Completion markers to check for response completion
    completion_markers = [
        r"(?:#+\s*)?(?:all\s+files\s+completed)(?:\s*#+)?",
        r"(?:#+\s*)?(?:response\s+completed)(?:\s*#+)?",
        r"(?:#+\s*)?(?:end\s+of\s+response)(?:\s*#+)?",
    ]

    logging.info(f"Starting continuation call for {website_id} with model {model}")

    try:
        while continuation_count < max_continuations:
            try:
                if continuation_count > 0:
                    logging.info(
                        f"Making continuation request #{continuation_count} for {website_id}"
                    )

                    continuation_message = {
                        "role": "user",
                        "content": (
                            "Please continue your previous response exactly where you left off. "
                            "Maintain the same format and structure. "
                            "If you've completed your response, end with '# Response Completed'."
                        ),
                    }
                    continuation_messages = initial_messages.copy()
                    continuation_messages.append(
                        {"role": "assistant", "content": full_response}
                    )
                    continuation_messages.append(continuation_message)

                    response = base_functions.call_gpt4_api(
                        continuation_messages, website_id, model
                    )
                else:
                    response = base_functions.call_gpt4_api(messages, website_id, model)

                parsed_response = base_functions.parse_ai_response(response, model)

                if not parsed_response.strip():
                    logging.warning(f"Received empty response for {website_id}")
                    continue

                # Handle HTML code block merging
                if continuation_count > 0:
                    # Remove the ```html marker if it starts with it
                    parsed_response = re.sub(r"^```html\s*\n", "", parsed_response)
                    # Remove any ``` at the start
                    parsed_response = re.sub(r"^```\s*\n", "", parsed_response)

                full_response += parsed_response

                # Check for completion
                if any(
                    re.search(marker, full_response, re.IGNORECASE | re.MULTILINE)
                    for marker in completion_markers
                ):
                    logging.info(
                        f"Completion marker found after {continuation_count+1} requests"
                    )
                    break

                continuation_count += 1

            except Exception as e:
                logging.error(
                    f"Error during continuation {continuation_count}: {str(e)}"
                )
                if continuation_count == max_continuations - 1:
                    raise
                continue

        if continuation_count >= max_continuations:
            logging.warning(
                f"Reached maximum continuations limit ({max_continuations}) for {website_id}"
            )

        return full_response

    except Exception as e:
        logging.error(
            f"Fatal error in call_with_continuation for {website_id}: {str(e)}"
        )
        raise


def parse_markdown(markdown):
    sections = markdown.split("## ")[1:]  # Split the markdown into sections
    file_contents = []
    for section in sections:
        lines = section.split("\n")
        filename = lines[0].strip()  # The filename is the first line of the section
        print("filename is: ", filename)
        code_block = "\n".join(lines[1:])  # The rest of the section is the code block
        if "```html" in code_block:
            code_lines = (
                code_block.split("```html")[1].split("```")[0].split("\n")
            )  # Extract the code lines and remove trailing backticks
            file_content = "\n".join(
                code_lines[1:]
            ).strip()  # Join the code lines into a single string
            file_contents.append((filename, file_content))
    return file_contents


def save_generated_pages(user_id: str, website_id: str, website_code: str) -> bool:
    """Parse and save generated pages to Supabase"""
    try:
        # Parse markdown into separate pages
        page_codes = parse_markdown(website_code)
        all_pages = []

        # Prepare bulk insert data
        pages_to_insert = [
            {
                "user_id": user_id,
                "website_id": website_id,
                "title": page_name,
                "content": page_code,
            }
            for page_name, page_code in page_codes
        ]

        # Save all pages in one operation
        supabase.table("pages").insert(pages_to_insert).execute()

        # Update website with page list
        supabase.table("websites").update(
            {"pages": [page[0] for page in page_codes], "status": "completed"}
        ).eq("user_id", user_id).eq("id", website_id).execute()

        return True
    except Exception as e:
        raise Exception(f"Failed to save generated pages: {str(e)}")
