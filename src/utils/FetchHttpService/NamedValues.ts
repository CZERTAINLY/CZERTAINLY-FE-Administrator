/**
 * Typed interface for an object holding string values associated to string keys.
 */
export interface StringMap {
   [key: string]: string;
}

/**
 * A simple collection of named string values.
 */
export class NamedValues {

   values: StringMap;

   get length(): number {
      return Object.keys(this.values).length;
   }

   /**
    * Initializes a new named values collection.
    * @param initializer key-value pairs to initialize the collection with
    */
   constructor(initializer?: StringMap) {
      this.values = { ...(initializer || {}) };
   }

   /**
    * Indicates whether the collection contains a value for a given key.
    * @param key The tested key
    */
   contains(key: string): boolean {
      return !!this.values[key];
   }

   /**
    * Gets the value associated with a given key.
    * @param key The name of the value that is being looked up.
    */
   get(key: string): string {
      return this.values[key];
   }

   /**
    * Removed the value associated with a given key from the collection.
    * @param key The name of the value to be deleted.
    */
   remove(key: string): void {
      delete this.values[key];
   }

   /**
    * Adds or changes the value associated with key.
    * @param key String key that names the value
    * @param value The value
    */
   set(key: string, value: string) {
      this.values[key] = value;
   }

}