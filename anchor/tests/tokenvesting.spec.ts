import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Tokenvesting} from '../target/types/tokenvesting'
import { BanksClient, ProgramTestContext, startAnchor } from 'solana-bankrun'
import { BankrunProvider } from 'anchor-bankrun'
import { SYSTEM_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/native/system'


// const IDL = require("../target/idl/tokenvesting.json")
import IDL from "../target/idl/tokenvesting.json"
import { createMint } from '@solana/spl-token'
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet'
// import { createMint } from 'spl-token-bankrun'


describe('Vesting Smart Contract tests', () => {

  const companyName = "Fumblr"

  let beneficiary : Keypair;
  let context : ProgramTestContext;
  let provider : BankrunProvider;
  let program : Program<Tokenvesting>;
  let banksClient : BanksClient;
  let employer : Keypair;
  let mint : PublicKey;
  let beneficiaryProvider : BankrunProvider;
  let program2 : Program<Tokenvesting>;
  let vestingAccountKey : PublicKey;
  let treasuryTokenAccount : PublicKey;
  let employeeAccount : PublicKey;
  



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
    );


    provider = new BankrunProvider(context)

    anchor.setProvider(provider);

    program = new Program<Tokenvesting>(IDL as Tokenvesting, provider);

    banksClient = context.banksClient;

    employer = provider.wallet.payer;

    mint = await createMint(
      //@ts-expect-error - Type mismatch in spl-token dependency
      banksClient,            // connection
      employer,               // payer
      employer.publicKey,     // mint authority 
      null,                   // freeze authority
      2                       // decimals
    );


    // setting up a different program for beneficiary instructions
    beneficiaryProvider = new BankrunProvider(context);
    beneficiaryProvider.wallet = new NodeWallet(beneficiary);

    program2 = new Program<Tokenvesting>(IDL as Tokenvesting, beneficiaryProvider);

    [vestingAccountKey] = PublicKey.findProgramAddressSync(
      [Buffer.from(companyName)],
      program.programId
    );

    [treasuryTokenAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("vesting_treasury"), Buffer.from(companyName)],
      program.programId
    );

    [employeeAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("employee_vesting"), 
        beneficiary.publicKey.toBuffer(), 
        vestingAccountKey.toBuffer()
      ],
      program.programId
    );
    
    


  })
})
