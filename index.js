class LRUCache {
  cache = {};
  maxItems = 0;

  constructor(maxItems) {
    this.maxItems = maxItems
  }

  get(key = "") {
    if (this.#existElementInCache(key)) {
      this.#updateLRUCacheKey(key)
      return this.cache[key].value
    }

    return undefined;
  }

  set(key = "", value) {
    // If already exist element just update value and LRUCacheKey and exit method
    if (this.#existElementInCache(key)) {
      this.#update(key, value)
      return;
    }

    if (!this.#hasSizeForNewElement()) {
      const { foundKey } = this.#getLeastRecentlyUsedKey();
      delete this.cache[foundKey]
    }

    const { leastRecentlyKey } = this.#getLeastRecentlyUsedKey();
    this.cache[key] = {
      value,
      LRUKey: leastRecentlyKey + 1,
    }

    this.#updateLRUCacheKey(key)
  }

  #update(key="", value){
    this.cache[key] = {
      ...this.cache[key],
      value,
    }
    this.#updateLRUCacheKey(key)
  }

  #getLeastRecentlyUsedKey() {
    let foundKey;
    let leastRecentlyKey = 0;
    this.#iterateCahe((key, element) => {
      if (element.LRUKey > leastRecentlyKey) {
        leastRecentlyKey = element.LRUKey
        foundKey = key;
      }
    })

    return { leastRecentlyKey, foundKey }
  }

  #updateLRUCacheKey(key = "") {
    this.cache[key] = {
      ...this.cache[key],
      LRUKey: 1,
    }

    this.#iterateCahe((iterationKey, element) => {
      if (key !== iterationKey) {
        this.cache[iterationKey] = {
          ...element,
          LRUKey: element.LRUKey + 1,
        }
      }
    })
  }

  #iterateCahe(callback = (key, element, index) => { }) {
    Object.keys(this.cache).forEach((key, index) => {
      callback(key, this.cache[key], index)
    })
  }

  #existElementInCache(key = "") {
    return this.cache.hasOwnProperty(key);
  }

  #getCacheSize() {
    return Object.keys(this.cache).length;
  }

  #hasSizeForNewElement() {
    return this.#getCacheSize() + 1 <= this.maxItems;
  }

  getAllCache() {
    let publicCacheObj = {};
    this.#iterateCahe((key, element) => {
      publicCacheObj[key] = element.value
    })

    return publicCacheObj;
  }
}

const c = new LRUCache(2)
// Case 1
console.log("---- Case 1 ---", "Should discard element because it wasn't getted or setted");
c.set("n1", "kevin")
console.log(c.getAllCache()); // { n1: 'kevin' }
c.set("n2", "anggie")
console.log(c.getAllCache()); // { n1: 'kevin', n2: 'anggie' }
c.set("n3", "juan")
console.log(c.getAllCache()); // { n2: 'anggie', n3: 'juan' }

// Case 2
console.log("---- Case 2 ---", "Should not discard element because it was setted");
c.set("n1", "kevin")
console.log(c.getAllCache()); // { n1: 'kevin' }
c.set("n2", "anggie")
console.log(c.getAllCache()); // { n1: 'kevin', n2: 'anggie' }
c.set("n1", "kevin updated")
console.log(c.getAllCache()); // { n1: 'kevin updated', n2: 'anggie' }
c.set("n3", "juan")
console.log(c.getAllCache()); // { n1: 'kevin updated', n3: 'juan' }

// Case 3
console.log("---- Case 3 ---", "Should not discard element because it was getted");
c.set("n1", "kevin")
console.log(c.getAllCache()); // { n1: 'kevin' }
c.set("n2", "anggie")
console.log(c.getAllCache()); // { n1: 'kevin', n2: 'anggie' }
c.get("n1")
console.log(c.getAllCache()); // { n1: 'kevin', n2: 'anggie' }
c.set("n3", "juan")
console.log(c.getAllCache()); // { n1: 'kevin', n3: 'juan' }

// Case 4
console.log("---- Case 5 ---", "Should not discard elements because they were getted and setted");
c.set("n1", "kevin")
console.log(c.getAllCache()); // { n1: 'kevin' }
c.set("n2", "anggie")
console.log(c.getAllCache()); // { n1: 'kevin', n2: 'anggie' }
c.get("n1")
c.set("n3", "juan")
console.log(c.getAllCache()); // { n1: 'kevin', n3: 'juan' }
c.set("n1", "kevin updated")
c.set("n2", "anggie")
console.log(c.getAllCache()); // { n1: 'kevin updated', n2: 'anggie' }
