import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Tokenvesting} from '../target/types/tokenvesting'
import { ProgramTestContext, startAnchor } from 'solana-bankrun'

// const IDL = require("../target/idl/tokenvesting.json")

import IDL from "../target/idl/tokenvesting.json"
import { SYSTEM_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/native/system'

describe('Vesting Smart Contract tests', () => {

  let beneficiary : Keypair;
  let context : ProgramTestContext

  beforeAll( async ()=> {
    // Configure the client to use the local cluster.
    beneficiary = new anchor.web3.Keypair();

    context = await startAnchor(
      "",
      [{ name : "tokenvesting", programId : new PublicKey(IDL.address)}],
      [
        {
          address : beneficiary.publicKey,
          info : {
            lamports : 1_000_000_000,
            data : Buffer.alloc(0),
            owner : SYSTEM_PROGRAM_ID,
            executable : false
          }
        }
      ],
    )
  })
})
