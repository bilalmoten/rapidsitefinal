import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageIcon, Link, FileText, Trash2, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export interface PCAsset {
  id: string;
  name: string;
  url: string;
  type: string;
  label?: string;
  description?: string;
}

export interface PCContentReference {
  id: string;
  name: string;
  url: string;
  type: string;
}

interface PCAssetUploaderProps {
  assets: PCAsset[];
  contentReferences: PCContentReference[];
  onFileUpload: (file: File) => void;
  onRemoveAsset: (id: string) => void;
  onRemoveContentReference: (id: string) => void;
}

export const PCAssetUploader: React.FC<PCAssetUploaderProps> = ({
  assets,
  contentReferences,
  onFileUpload,
  onRemoveAsset,
  onRemoveContentReference,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [assetLabel, setAssetLabel] = useState("");
  const [assetDescription, setAssetDescription] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadImage = () => {
    if (imageFile) {
      onFileUpload(imageFile);
      setIsDialogOpen(false);
      setImageFile(null);
      setImagePreview(null);
      setAssetLabel("");
      setAssetDescription("");
      toast({
        title: "Image uploaded",
        description: "Your image has been added to the assets library.",
      });
    }
  };

  const handleAddReference = () => {
    if (referenceUrl) {
      // Create a fake "file" with the URL
      const fakeFile = new File([""], "reference.txt", { type: "text/plain" });
      const dataToAdd = {
        id: Date.now().toString(),
        name: referenceUrl,
        url: referenceUrl,
        type: "reference",
      };

      // Call the parent component's handler with our reference data
      onFileUpload(
        Object.defineProperty(fakeFile, "customData", {
          value: dataToAdd,
          writable: false,
        })
      );

      setReferenceUrl("");
      toast({
        title: "Reference added",
        description: "Your content reference has been added.",
      });
    }
  };

  return (
    <Tabs defaultValue="images" className="w-full">
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
                      onClick={() => onRemoveAsset(asset.id)}
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
                {contentReferences.map((ref) => (
                  <div
                    key={ref.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Link className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{ref.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveContentReference(ref.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No references yet</h3>
                <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                  Add links to your existing website, social media, or any other
                  content to help the AI understand your brand.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
