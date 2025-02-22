import { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

const API_USERS = "http://98.82.253.61:8001";
const API_TRANSACTIONS = "http://98.82.253.61:8002";
const API_CAMPAIGNS = "http://98.82.253.61:8003";

interface User {
	id: string;
	name: string;
	email: string;
}

interface Transaction {
	id: string;
	user_id: string;
	amount: number;
	merchant: string;
	account_type: string;
	status: string;
}

interface Campaign {
	id: string;
	name: string;
	goal: number;
	cashback_percentage: number;
}

const UserTransactionCampaigns = () => {
	const [userId, setUserId] = useState<string>("");
	const [transactionId, setTransactionId] = useState<string>("");
	const [searchedUser, setSearchedUser] = useState<User | null>(null);
	const [searchedTransaction, setSearchedTransaction] =
		useState<Transaction | null>(null);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [campaigns, setCampaigns] = useState<Campaign[]>([]);

	const fetchUserById = async () => {
		if (!userId) return;
		try {
			const response = await fetch(`${API_USERS}/users/${userId}`);
			const data: User = await response.json();
			setSearchedUser(data);
		} catch {
			setSearchedUser(null);
		}
	};

	const fetchTransactionById = async () => {
		if (!transactionId) return;
		try {
			const response = await fetch(
				`${API_TRANSACTIONS}/transactions/${transactionId}`,
			);
			const data: Transaction = await response.json();
			setSearchedTransaction(data);
		} catch {
			setSearchedTransaction(null);
		}
	};

	const fetchTransactionsByUser = async () => {
		if (!userId) return;
		try {
			const response = await fetch(
				`${API_TRANSACTIONS}/users/${userId}/transactions`,
			);
			const data: Transaction[] = await response.json();
			setTransactions(data || []);
		} catch {
			setTransactions([]);
		}
	};

	const fetchCampaignsByUser = async () => {
		if (!userId) return;
		try {
			const response = await fetch(
				`${API_CAMPAIGNS}/users/${userId}/campaigns`,
			);
			const data: Campaign[] = await response.json();
			setCampaigns(data || []);
		} catch {
			setCampaigns([]);
		}
	};

	return (
		<div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
			<h1 className="text-2xl font-bold text-center mb-6">Gestión de Datos</h1>
			<Tabs defaultValue="user">
				<TabsList className="mb-4">
					<TabsTrigger value="user">Usuario</TabsTrigger>
					<TabsTrigger value="transaction">Transacción</TabsTrigger>
					<TabsTrigger value="campaigns">Campañas</TabsTrigger>
				</TabsList>

				<TabsContent value="user">
					<Card>
						<CardContent className="space-y-4">
							<Input
								placeholder="Ingrese User ID"
								value={userId}
								onChange={(e) => setUserId(e.target.value)}
							/>
							<Button onClick={fetchUserById} disabled={!userId}>
								Buscar Usuario
							</Button>
							{searchedUser && (
								<div>
									<p>ID: {searchedUser.id}</p>
									<p>Nombre: {searchedUser.name}</p>
									<p>Email: {searchedUser.email}</p>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="transaction">
					<Card>
						<CardContent className="space-y-4">
							<Input
								placeholder="Ingrese Transaction ID"
								value={transactionId}
								onChange={(e) => setTransactionId(e.target.value)}
							/>
							<Button onClick={fetchTransactionById} disabled={!transactionId}>
								Buscar Transacción
							</Button>
							{searchedTransaction && (
								<div>
									<p>ID: {searchedTransaction.id}</p>
									<p>User ID: {searchedTransaction.user_id}</p>
									<p>Monto: {searchedTransaction.amount}</p>
									<p>Merchant: {searchedTransaction.merchant}</p>
									<p>Tipo de Cuenta: {searchedTransaction.account_type}</p>
									<p>Estado: {searchedTransaction.status}</p>
								</div>
							)}
							<Input
								placeholder="Ingrese User ID"
								value={userId}
								onChange={(e) => setUserId(e.target.value)}
							/>
							<Button onClick={fetchTransactionsByUser} disabled={!userId}>
								Buscar Transacciones por Usuario
							</Button>

							{transactions.length > 0 && (
								<div className="space-y-2">
									{transactions.map((t) => (
										<div key={t.id} className="border p-2 rounded-md">
											<p>ID: {t.id}</p>
											<p>User ID: {t.user_id}</p>
											<p>Monto: {t.amount}</p>
											<p>Merchant: {t.merchant}</p>
											<p>Tipo de Cuenta: {t.account_type}</p>
											<p>Estado: {t.status}</p>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="campaigns">
					<Card>
						<CardContent className="space-y-4">
							<Button onClick={fetchCampaignsByUser} disabled={!userId}>
								Cargar Campañas
							</Button>
							{campaigns.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{campaigns.map((c) => (
										<Card key={c.id}>
											<CardContent>
												<p>
													<strong>{c.name}</strong>
												</p>
												<p>Meta: {c.goal}</p>
												<p>Cashback: {c.cashback_percentage}%</p>
											</CardContent>
										</Card>
									))}
								</div>
							) : (
								<p className="text-gray-500">No hay campañas</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default UserTransactionCampaigns;
