import express from 'express';
import Wallet from '@/models/wallet.model';
import { encrypt } from '@/utils/crypto';
import { createEthWallet } from '@/utils/wallet';
import { reportError } from '@/utils/logger';
import { HydratedDocument } from 'mongoose';
import { IUser } from '@/models/user.model';

export const createWallet = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const password = req.body?.password;

    if (!password) {
      return res.status(400).send({ error: 'Password is required' });
    }

    if (password.length < 8) {
      return res.status(400).send({
        error: 'Password should be greater than or equal to 8 characters',
      });
    }

    const wallet = createEthWallet();

    if (!wallet) {
      return res.status(500).send({
        error: 'Error creating wallet',
      });
    }

    if (!wallet?.mnemonic) {
      return res.status(500).send({
        error: 'Error creating wallet',
      });
    }

    const pubKey = encrypt(wallet.address.toLowerCase(), password);
    const privKey = encrypt(wallet.mnemonic.phrase, password);

    const owner = <HydratedDocument<IUser>>req.user;

    await new Wallet({ owner: owner._id, pubKey, privKey }).save();

    return res.status(201).send({ message: 'Wallet created successfully' });
  } catch (error) {
    reportError(error as Error, 'Error creating wallet');
    return res.status(500).send({ error: 'Internal server error' });
  }
};
