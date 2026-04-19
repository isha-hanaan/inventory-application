export interface Item {
  _id: string;
  name: string;
  length: number;
  width: number;
  thickness: number;
  type: string;
  price: number;
  quantity: number;
}

export interface ItemForm {
  name: string;
  length: number;
  width: number;
  thickness: number;
  type: string;
  price: number;
  quantity: number;
}
