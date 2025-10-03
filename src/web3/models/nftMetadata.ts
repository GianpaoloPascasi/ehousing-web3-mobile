export interface NFTAttributes {
  trait_type: string;
  value: string;
}
export interface NFTMetadata {
  description: string;
  external_url: string;
  image: string;
  name: string;
  attributes: NFTAttributes[];
}
