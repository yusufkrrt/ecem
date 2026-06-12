export interface Message {
  id: string;
  sender: 'Yusuf' | 'Ece';
  content: string;
  createdAt: any; // Firestore timestamp
}
