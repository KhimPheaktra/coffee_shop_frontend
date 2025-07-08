import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class HashService {

  constructor() { }
  
  // generate_hash_with_key(textToBeGenerate: string): string{
  //   let key = "SecretKey123";
  //   let hash = CryptoJS.HmacSHA256(textToBeGenerate, key).toString(CryptoJS.enc.Hex);
  //   return hash;
  // }
}

