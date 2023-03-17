import express from 'express';
import Wallet from '@/models/wallet.model';
import { encrypt } from '@/utils/crypto';
import { createEthWallet } from '@/utils/wallet';
import { reportError } from '@/utils/logger';

export const createWallet = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const password = req.body?.password;

    if (!password) {
      return res.send(400).json({ error: 'Password is required' });
    }

    if (password.length < 8) {
      return res.send(400).json({
        error: 'Password should be greater than or equal to 8 characters',
      });
    }

    const wallet = createEthWallet();

    if (!wallet) {
      return res.send(500).json({
        error: 'Error creating wallet',
      });
    }

    if (!wallet?.mnemonic) {
      return res.send(500).json({
        error: 'Error creating wallet',
      });
    }

    const pubKey = encrypt(wallet.address.toLowerCase(), password);
    const privKey = encrypt(wallet.mnemonic.phrase, password);

    await new Wallet({ pubKey, privKey }).save();

    return res.send(201).json({ message: 'Wallet created successfully' });
  } catch (error) {
    reportError(error as Error, 'Error creating wallet');
    return res.send(500).json({ error: 'Internal server error' });
  }
};
