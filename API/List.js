const {
  Type
} = require("./Type")
/**
 * Unordered List
 *
 * @class List
 * @extends {Array}
 * @template T
 */
class List extends Array {
  /**
   *Creates an instance of List.
   * @param {List} props List
   * @template T
   * @param {T} props
   * @returns {List<T>}
   * @memberof List
   */
  constructor(props) {
    if (!props) {
      super();
      return;
    }
    super(props);
  }
  /**
   *Add a Value to the List
   * @template T
   * @param {T} value
   * @memberof List
   */
  Add(value) {
    this.push(value);
  }
  Any(action) {
    return this.some(action);
  }
  /**
   *Convert Array to List
   *
   * @static
   * @param {Array} array
   * @returns List
   * @memberof List
   */
  static ToList(array) {
    let t = new List();
    for (let item of array) {
      t.Add(item);
    }
    return t;
  }
  /**
   * Concat 2 Lists
   * @param {List} list
   */
  AddRange(list) {
    if (list == null) throw new Error("ArgumentNullException");
    if (!(Type.Get(list) == "List"))
      throw new Error("AddRange: Expected type List");
    for (var item of list) {
      this.Add(item);
    }
  }
  /**
   *Clear the List
   *
   * @memberof List
   */
  Clear() {
    this.splice(0, this.length);
  }
  /**
   * Does the List contain a given item
   * @param {*} item
   */
  Contains(item) {
    return this.includes(item);
  }
  get Count() {
    return this.length;
  }
  /**
   *
   * @param {*} match
   */
  Exists(match) {
    //TODO
  }
  /**
   *
   *
   * @param {*} match
   *
   * @memberof List
   */
  Find(match) {
    return this.find(match);
  }
  /**
   *
   *
   * @param {*} action
   * @memberof List
   */
  ForEach(action) {
    this.forEach(action);
  }
  /**
   *
   *
   * @param {*} iValue
   * @returns {Number} Index
   * @memberof List
   */
  Remove(iValue) {
    var iIndex = this.indexOf(iValue);
    if (iIndex > -1) {
      this.RemoveAt(iIndex);
    }
    return iIndex;
  }
  /**
   *
   *
   * @param {Number} iIndex
   * @returns {*} Removed Item
   * @memberof List
   */
  RemoveAt(iIndex) {
    var vItem = this[iIndex];
    if (vItem) {
      this.splice(iIndex, 1);
    }
    return vItem;
  }
  /**
   *
   * @param {} value
   * @param {Out<T>} out
   */
  TryGetValue(value, out) {
    if (value == null) return false;
    if (!this.includes(value)) return false;
    if (out) out.Out = value;
    return true;
  }
  ToArray() {
    return; //TODO
  }
  Sort(compareFn) {
    return this.sort(compareFn);
  }
}
module.exports = {
  List
}