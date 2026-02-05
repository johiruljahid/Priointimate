
// services/firebase.ts
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  addDoc, 
  onSnapshot,
  orderBy,
  increment,
  arrayUnion,
  Timestamp
} from "firebase/firestore";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { UserProfile, GirlProfile, PaymentRequest, WithdrawRequest } from "../types";

const firebaseConfig = {
  apiKey: "AIzaSyBw_3va46in_nhGADNQ1uwvX8eJns9Dn6U",
  authDomain: "priointimate.firebaseapp.com",
  projectId: "priointimate",
  storageBucket: "priointimate.firebasestorage.app",
  messagingSenderId: "371161602737",
  appId: "1:371161602737:web:9210ee2dc725927b752090"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const signUpUser = async (name: string, email: string, pass: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const firebaseUser = userCredential.user;
  const userData: UserProfile = {
    id: firebaseUser.uid,
    name,
    email,
    referralCode: name.split(' ')[0].toUpperCase() + Math.floor(Math.random() * 999),
    balance: 0,
    referralEarnings: 0,
    credits: 0,
    totalCommissionPaid: 0,
    referredBy: null,
    withdrawalRequests: [],
    unlockedItems: [], 
  };
  await setDoc(doc(db, "users", firebaseUser.uid), { ...userData, createdAt: Timestamp.now() });
  return userData;
};

export const signInUser = async (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);
export const logoutUser = () => signOut(auth);
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => onAuthStateChanged(auth, callback);

export const syncUserByUid = (uid: string, callback: (user: UserProfile | null) => void) => {
  return onSnapshot(doc(db, "users", uid), (snapshot) => {
    if (snapshot.exists()) callback({ id: snapshot.id, ...snapshot.data() } as UserProfile);
    else callback(null);
  });
};

export const unlockContentDB = async (userId: string, itemId: string, cost: number) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error("ইউজার পাওয়া যায়নি");
  const userData = userSnap.data();
  if ((userData.credits || 0) < cost) throw new Error("পর্যাপ্ত ক্রেডিট নেই");

  // Atomic update: credits down, unlockedItems push
  await updateDoc(userRef, {
    credits: increment(-cost),
    unlockedItems: arrayUnion(itemId)
  });
};

// Added deductCreditsDB to fix App.tsx error: atomic deduction of user credits
export const deductCreditsDB = async (userId: string, amount: number) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    credits: increment(-amount)
  });
};

export const syncAllModels = (callback: (models: GirlProfile[]) => void) => {
  return onSnapshot(collection(db, "models"), (snap) => {
    callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as GirlProfile)));
  });
};

export const addModelDB = async (model: GirlProfile) => {
  const modelRef = doc(collection(db, "models"));
  const data = { ...model, id: modelRef.id };
  await setDoc(modelRef, data);
  return data;
};

export const updateModelDB = async (model: GirlProfile) => {
  await updateDoc(doc(db, "models", model.id), { ...model });
};

export const deleteModelDB = async (id: string) => {
  await deleteDoc(doc(db, "models", id));
};

export const createPaymentRequestDB = async (payment: Omit<PaymentRequest, 'id' | 'status' | 'timestamp'>) => {
  await addDoc(collection(db, "payments"), { ...payment, status: 'pending', timestamp: Timestamp.now() });
};

export const approvePaymentDB = async (paymentId: string) => {
  const payRef = doc(db, "payments", paymentId);
  const paySnap = await getDoc(payRef);
  if (!paySnap.exists()) return;
  const payData = paySnap.data() as PaymentRequest;
  await updateDoc(doc(db, "users", payData.userId), { credits: increment(payData.credits) });
  await updateDoc(payRef, { status: 'completed' });
};

export const syncAllPayments = (cb: (p: PaymentRequest[]) => void) => onSnapshot(query(collection(db, "payments"), orderBy("timestamp", "desc")), snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as PaymentRequest))));
export const syncAllWithdrawals = (cb: (w: WithdrawRequest[]) => void) => onSnapshot(query(collection(db, "withdrawals"), orderBy("timestamp", "desc")), snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as WithdrawRequest))));
export const syncAllUsers = (cb: (u: UserProfile[]) => void) => onSnapshot(collection(db, "users"), snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as UserProfile))));

export const createWithdrawRequestDB = async (req: Omit<WithdrawRequest, 'id' | 'status' | 'timestamp'>) => {
  await addDoc(collection(db, "withdrawals"), { ...req, status: 'pending', timestamp: Timestamp.now() });
  await updateDoc(doc(db, "users", req.userId), { referralEarnings: increment(-req.amount) });
};

export const approveWithdrawDB = async (id: string) => {
  const snap = await getDoc(doc(db, "withdrawals", id));
  if (!snap.exists()) return;
  const data = snap.data() as WithdrawRequest;
  await updateDoc(doc(db, "users", data.userId), { totalCommissionPaid: increment(data.amount) });
  await updateDoc(doc(db, "withdrawals", id), { status: 'completed' });
};
