export enum AspectRatio {
  Square = "1:1",
  Landscape = "16:9",
  Portrait = "9:16",
  Standard = "4:3",
  PortraitStandard = "3:4"
}

export enum ModelType {
  Flash = "gemini-2.5-flash-image",
  Pro = "gemini-3-pro-image-preview"
}

export enum ImageSize {
  Size1K = "1K",
  Size2K = "2K",
  Size4K = "4K"
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  aspectRatio: string;
  model: ModelType;
  timestamp: number;
}

export interface GenerationConfig {
  prompt: string;
  model: ModelType;
  aspectRatio: AspectRatio;
  size?: ImageSize;
}
