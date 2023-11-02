/**
 * Provides basic CRUD operations to store
 * objects JSON encoded in {@link localStorage}
 */
export class LocalStorageCRUDRepository<T> {

    constructor(private storageKey: string) {}
  
    /**
     * Saves an object to {@link localStorage} and
     * assigns it an incrimental id.
     * 
     * @param item to store 
     * @returns created item
     */
    public save(item: T): T {
      let items: any[] = this.fetchAll();
      let id: number = 0;
      if(items.length >= 1) id = parseInt(items[items.length - 1].id) + 1;
  
      let newItem: T = {
        ...item,
        id: id.toString()
      };
      items.push(newItem);
      localStorage.setItem(this.storageKey, JSON.stringify(items));
      return newItem;
    }

    /**
     * Inserts an object into the {@link localStorage}.
     * When an object with the same id already exists,
     * it will be replaced.
     * 
     * @param item to insert 
     * @returns inserted item
     */
    public insert(item: T): T {
      let items: any[] = this.fetchAll();
      // Remove existing item
      items = items.filter(i => i.id !== (item as any).id);
      items.push(item);
      localStorage.setItem(this.storageKey, JSON.stringify(items));
      return item;
    }
  
    /**
     * Deletes an object from {@link localStorage}
     *
     * @param item to delete
     * @returns if deletion was successful
     */
    public delete(item: T): boolean {
      return this.deleteById((item as any).id);
    }

    /**
     * Delete an object by id from {@link localStorage}
     * 
     * @param id of the object
     * @returns if deletion was successful
     */
    public deleteById(id: string): boolean {
      let items: any[] = this.fetchAll();
      for(let i = 0; i < items.length; i++) {
        if(items[i].id === id) {
          items.splice(i, 1);
          localStorage.setItem(this.storageKey, JSON.stringify(items));
          return true;
        }
      }
      return false;
    }
  
    /**
     * Replaces item in {@link localStorage}
     *  
     * @param item to replace
     * @returns if replacement was successful
     */
    public replace(item: T): boolean {
      let items: any[] = this.fetchAll();
      for(let i = 0; i < items.length; i++) {
        if(items[i].id === (item as any).id) {
          items[i] = item;
          localStorage.setItem(this.storageKey, JSON.stringify(items));
          return true;
        }
      }
      return false;
    }
  
    /**
     * Fetches all available items from {@link localStorage}
     * @returns fetches items
     */
    public fetchAll(): T[] {
      return JSON.parse(localStorage.getItem(this.storageKey) ?? "[]");
    }
  
    /**
     * Returns an object from {@link localStorage} by id
     *  
     * @param id of object
     * @returns undefined when object was not found
     */
    public findById(id: string): T | undefined {
      let items: any[] = this.fetchAll();
      return items.find((item, _, __) => item.id === id);
    }
  }