export type Address = {
  houseNumber: string ,
  floor: number ,
  landmark: string ,
  streetNumber: number,
  colony: string ,
  area: string ,
  district: string ,
  pincode: string ,
  title: string ,
  _id : string
};

export type UserDetails = {
  _id : string,
  first_name : string,
  last_name : string,
  image : string,
  contact_number : string,
  email_address : string
}

export type Message = {
  message : string,
  sender : string,
  user : string,
  time : Date
}