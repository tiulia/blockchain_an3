import { PinataSDK } from "pinata-web3";
import { pinataJwt, pinataGateway } from '../config'


export const pinata = new PinataSDK({
  pinataJwt,
  pinataGateway,
});