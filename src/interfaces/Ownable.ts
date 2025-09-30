export interface Ownable {
  /**
   * Given an entity ID, returns the owner's ID
   */
  getOwnerId(id: string): Promise<string | null>;
}
