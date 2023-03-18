import mongoose, { Types, Schema } from 'mongoose';

export interface IWallet {
  owner: Types.ObjectId;
  pubKey: {
    encryptedMessage: string;
    iv: string;
    salt: string;
  };
  privKey: {
    encryptedMessage: string;
    iv: string;
    salt: string;
  };
  createdAt: number;
}

const WalletSchema = new Schema<IWallet>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  pubKey: {
    encryptedMessage: {
      type: String,
      required: true,
    },
    iv: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
  },
  privKey: {
    encryptedMessage: {
      type: String,
      required: true,
    },
    iv: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Number,
    required: true,
    default: Math.floor(new Date().getTime()),
  },
});

const Wallet = mongoose.model<IWallet>('Wallet', WalletSchema);

export default Wallet;
