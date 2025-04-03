"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useProChatStore, PCUploadedAsset } from "@/hooks/useProChatStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import {
  Upload,
  Link,
  Image as ImageIcon,
  FileText,
  Trash2,
  Plus,
} from "lucide-react";

export default function AssetsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const assets = useProChatStore((state) => state.projectBrief.assets);
  const contentReferences = useProChatStore(
    (state) => state.projectBrief.contentReferences
  );
  const addAsset = useProChatStore((state) => state.addAsset);
  const removeAsset = useProChatStore((state) => state.removeAsset);
  const addContentReference = useProChatStore(
    (state) => state.addContentReference
  );
  const removeContentReference = useProChatStore(
    (state) => state.removeContentReference
  );

  const [referenceUrl, setReferenceUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [assetLabel, setAssetLabel] = useState("");
  const [assetDescription, setAssetDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddReference = () => {
    if (!referenceUrl) return;

    addContentReference(referenceUrl);
    setReferenceUrl("");
    toast({
      title: "Reference Added",
      description: "Your content reference has been added successfully.",
    });
  };

  const handleUploadImage = () => {
    if (imageFile && imagePreview) {
      // In a real app, you would upload to a storage service
      // For now, we'll just use the file preview URL
      const newAsset: PCUploadedAsset = {
        id: uuidv4(),
        name: imageFile.name,
        url: imagePreview,
        type: "image",
        label: assetLabel || undefined,
        description: assetDescription || undefined,
      };

      addAsset(newAsset);
      setImageFile(null);
      setImagePreview(null);
      setAssetLabel("");
      setAssetDescription("");
      setIsDialogOpen(false);

      toast({
        title: "Image Uploaded",
        description: "Your image has been uploaded successfully.",
      });
    }
  };

  const handleRemoveAsset = (id: string) => {
    removeAsset(id);
    toast({
      title: "Asset Removed",
      description: "The asset has been removed successfully.",
    });
  };

  const handleRemoveReference = (index: number) => {
    removeContentReference(index);
    toast({
      title: "Reference Removed",
      description: "The reference has been removed successfully.",
    });
  };

  const navigateToProChat = () => {
    router.push("/dashboard/pro-chat");
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Website Assets</h1>
          <p className="text-muted-foreground mt-1">
            Upload and manage your website content and reference materials
          </p>
        </div>
        <Button onClick={navigateToProChat}>Go to Pro Chat</Button>
      </div>

      <Tabs defaultValue="images" className="max-w-5xl mx-auto">
        <TabsList className="mb-6">
          <TabsTrigger value="images" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" /> Images
          </TabsTrigger>
          <TabsTrigger value="references" className="flex items-center gap-2">
            <Link className="h-4 w-4" /> References
          </TabsTrigger>
        </TabsList>

        <TabsContent value="images">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Upload card */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Card className="h-64 cursor-pointer hover:border-primary/50 transition-colors">
                  <CardContent className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="h-12 w-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                        <Plus className="h-6 w-6" />
                      </div>
                      <h3 className="font-medium">Upload New Image</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Add images for your website
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Image</DialogTitle>
                  <DialogDescription>
                    Upload an image for your website. You can add a label and
                    description to help organize your assets.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="image">Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>

                  {imagePreview && (
                    <div className="mt-4">
                      <Label>Preview</Label>
                      <div className="mt-2 border rounded-md overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-40 w-full object-contain"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="label">Label (optional)</Label>
                    <Input
                      id="label"
                      placeholder="e.g., Hero image"
                      value={assetLabel}
                      onChange={(e) => setAssetLabel(e.target.value)}
                    />
                  </div>

                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Add a description for this image"
                      value={assetDescription}
                      onChange={(e) => setAssetDescription(e.target.value)}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={handleUploadImage}
                    disabled={!imageFile}
                  >
                    Upload
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Image cards */}
            {assets
              .filter((asset) => asset.type === "image")
              .map((asset) => (
                <Card key={asset.id} className="overflow-hidden">
                  <div className="aspect-video relative group">
                    <img
                      src={asset.url}
                      alt={asset.label || asset.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveAsset(asset.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardFooter className="p-3">
                    <div>
                      <h3 className="font-medium text-sm truncate">
                        {asset.label || asset.name}
                      </h3>
                      {asset.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {asset.description}
                        </p>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>

          {assets.filter((asset) => asset.type === "image").length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No images yet</h3>
              <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                Upload images to use in your website. These will be available to
                the AI when designing your site.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="references">
          <Card>
            <CardHeader>
              <CardTitle>Content References</CardTitle>
              <CardDescription>
                Add website URLs or documents for the AI to reference when
                creating your website content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 mb-6">
                <Input
                  placeholder="Enter website URL or content reference"
                  value={referenceUrl}
                  onChange={(e) => setReferenceUrl(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddReference}>Add Reference</Button>
              </div>

              {contentReferences.length > 0 ? (
                <div className="space-y-3">
                  {contentReferences.map((ref, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Link className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{ref}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveReference(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">
                    No references yet
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                    Add links to your existing website, social media, or any
                    other content to help the AI understand your brand.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
