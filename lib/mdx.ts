import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'

const POSTS_PATH = path.join(process.cwd(), 'app/blog/posts')

export interface Post {
    slug: string
    title: string
    description: string
    date: string
    author: string
    coverImage: string
    content: string
    published: boolean
}

function getPostFilePaths(): string[] {
    return fs
        .readdirSync(POSTS_PATH)
        .filter((path) => /\.mdx?$/.test(path))
}

export function getAllPosts(): Post[] {
    const posts = getPostFilePaths()
        .map((filePath) => {
            const source = fs.readFileSync(path.join(POSTS_PATH, filePath), 'utf8')
            const { data, content } = matter(source)

            const slug = filePath.replace(/\.mdx?$/, '')

            return {
                ...data,
                slug,
                content,
            } as Post
        })
        .filter((post) => post.published)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return posts
}

export function getPostBySlug(slug: string): Post | null {
    try {
        const source = fs.readFileSync(
            path.join(POSTS_PATH, `${slug}.mdx`),
            'utf8'
        )
        const { data, content } = matter(source)

        return {
            ...data,
            slug,
            content,
        } as Post
    } catch (error) {
        return null
    }
} 