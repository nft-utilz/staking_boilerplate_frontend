import { db } from "../db/firebase-config";

import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

export const getUser = async (wallet: string) => {
  try {
    const modelRef = collection(db, `whitelist_project_name/users/${wallet}`);
    const user = await getDocs(modelRef);
    return user;
  } catch (error) {
    console.error(error);
  }
};

export const createUser = async (wallet: string, walletDocId: string) => {
  const userDoc = await getUser(wallet);
  const init = async () => {
    const userRef = collection(db, `whitelist_project_name/users/${wallet}`);
    const user = { wallet, createdAt: serverTimestamp(), walletDocId };
    await addDoc(userRef, user);
  };
  userDoc?.empty && (await init());
};

export const fetchWallet = async (wallet: string) => {
  try {
    const userDoc = await getUser(wallet);
    if (!userDoc?.empty) return;
    console.log("user isn't in the db");

    // query if the wallet exists or not
    const _modelRef = collection(db, `whitelist_project_name/entities/wallets`);

    const qry = query(_modelRef);
    const doc = await getDocs(qry);
    console.log("doc from fetchWallet", doc);

    const createDoc = async () => {
      const modelsRef = collection(
        db,
        `whitelist_project_name/entities/wallets`
      );
      const doc = await addDoc(modelsRef, { date: serverTimestamp(), wallet });
      return createUser(wallet, doc.id);
    };

    return await createDoc();
  } catch (err) {
    console.error(err);
    return "";
  }
};

export const getWallets = async (): Promise<string[]> => {
  try {
    let walletArr: string[] = [];
    const _modelRef = collection(db, `whitelist_project_name/entities/wallets`);
    const qry = query(_modelRef);
    const wallets = await getDocs(qry);
    wallets.forEach((wallet) => {
      walletArr.push(wallet.data().wallet);
    });
    return walletArr;
  } catch (err) {
    console.error(err);
    return [];
  }
};
