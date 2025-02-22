import { useState, useCallback } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

const API_USERS = "http://98.82.253.61:8001";
const API_TRANSACTIONS = "http://98.82.253.61:8002";
const API_CAMPAIGNS = "http://98.82.253.61:8003";

interface Account {
	id: number;
	account_type: string;
	balance: number;
	currency: string;
}

interface CreditCard {
	id: number;
	card_number: string;
	expiration_date: string;
	status: string;
}

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

const useApi = () => {
	const fetchData = async (url: string) => {
		try {
			const response = await fetch(url);
			if (!response.ok) throw new Error("Failed to fetch data");
			return await response.json();
		} catch (error) {
			console.error("Error fetching data:", error);
			throw error;
		}
	};
	return { fetchData };
};

const UserDetails = ({ user }: { user: User }) => (
	<div className="space-y-2">
		<p className="text-gray-700">
			<strong>ID:</strong> {user.id}
		</p>
		<p className="text-gray-700">
			<strong>Nombre:</strong> {user.name}
		</p>
		<p className="text-gray-700">
			<strong>Email:</strong> {user.email}
		</p>
	</div>
);

const TransactionDetails = ({ transaction }: { transaction: Transaction }) => (
	<div className="space-y-2">
		<p className="text-gray-700">
			<strong>ID:</strong> {transaction.id}
		</p>
		<p className="text-gray-700">
			<strong>User ID:</strong> {transaction.user_id}
		</p>
		<p className="text-gray-700">
			<strong>Monto:</strong> {transaction.amount}
		</p>
		<p className="text-gray-700">
			<strong>Merchant:</strong> {transaction.merchant}
		</p>
		<p className="text-gray-700">
			<strong>Tipo de Cuenta:</strong> {transaction.account_type}
		</p>
		<p className="text-gray-700">
			<strong>Estado:</strong> {transaction.status}
		</p>
	</div>
);

const CampaignDetails = ({ campaign }: { campaign: Campaign }) => (
	<Card className="hover:shadow-md transition-shadow">
		<CardContent className="p-4">
			<p className="text-lg font-semibold text-gray-800">{campaign.name}</p>
			<p className="text-gray-700">
				<strong>Meta:</strong> {campaign.goal}
			</p>
			<p className="text-gray-700">
				<strong>Cashback:</strong> {campaign.cashback_percentage}%
			</p>
		</CardContent>
	</Card>
);

const AccountDetails = ({ account }: { account: Account }) => (
	<Card className="p-4 mb-2 hover:shadow-md transition-shadow">
		<p className="text-gray-700">
			<strong>ID:</strong> {account.id}
		</p>
		<p className="text-gray-700">
			<strong>Tipo:</strong> {account.account_type}
		</p>
		<p className="text-gray-700">
			<strong>Saldo:</strong> {account.balance} {account.currency}
		</p>
	</Card>
);

const CreditCardDetails = ({ card }: { card: CreditCard }) => (
	<Card className="p-4 mb-2 hover:shadow-md transition-shadow">
		<p className="text-gray-700">
			<strong>ID:</strong> {card.id}
		</p>
		<p className="text-gray-700">
			<strong>Número:</strong> {card.card_number}
		</p>
		<p className="text-gray-700">
			<strong>Expira:</strong> {card.expiration_date}
		</p>
		<p className="text-gray-700">
			<strong>Estado:</strong> {card.status}
		</p>
	</Card>
);

const UserTransactionCampaigns = () => {
	const [userId, setUserId] = useState<string>("");
	const [transactionId, setTransactionId] = useState<string>("");
	const [searchedUser, setSearchedUser] = useState<User | null>(null);
	const [searchedTransaction, setSearchedTransaction] =
		useState<Transaction | null>(null);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [campaigns, setCampaigns] = useState<Campaign[]>([]);
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const { fetchData } = useApi();

	const handleApiError = useCallback((err: unknown, defaultMessage: string) => {
		console.error(err);
		setError(defaultMessage);
	}, []);

	const fetchUserById = async () => {
		if (!userId) return;
		setLoading(true);
		setError(null);
		try {
			const data = await fetchData(`${API_USERS}/users/${userId}`);
			setSearchedUser(data);
			setAccounts([]);
			setCreditCards([]);
		} catch (err) {
			handleApiError(err, "Error al buscar el usuario.");
			setSearchedUser(null);
		} finally {
			setLoading(false);
		}
	};

	const fetchAccounts = useCallback(async () => {
		if (!userId) return;
		setLoading(true);
		setError(null);
		try {
			const data = await fetchData(`${API_USERS}/users/${userId}/accounts`);
			setAccounts(data || []);
		} catch (err) {
			handleApiError(err, "Error al cargar cuentas.");
			setAccounts([]);
		} finally {
			setLoading(false);
		}
	}, [userId, fetchData, handleApiError]);

	const fetchCreditCards = useCallback(async () => {
		if (!userId) return;
		setLoading(true);
		setError(null);
		try {
			const data = await fetchData(`${API_USERS}/users/${userId}/credit-cards`);
			setCreditCards(data || []);
		} catch (err) {
			handleApiError(err, "Error al cargar tarjetas de crédito.");
			setCreditCards([]);
		} finally {
			setLoading(false);
		}
	}, [userId, fetchData, handleApiError]);

	const fetchTransactionById = async () => {
		if (!transactionId) return;
		setLoading(true);
		setError(null);
		try {
			const data = await fetchData(
				`${API_TRANSACTIONS}/transactions/${transactionId}`,
			);
			setSearchedTransaction(data);
		} catch (err) {
			handleApiError(err, "Error al buscar la transacción.");
			setSearchedTransaction(null);
		} finally {
			setLoading(false);
		}
	};

	const fetchTransactionsByUser = async () => {
		if (!userId) return;
		setLoading(true);
		setError(null);
		try {
			const data = await fetchData(
				`${API_TRANSACTIONS}/users/${userId}/transactions`,
			);
			setTransactions(data || []);
		} catch (err) {
			handleApiError(err, "Error al buscar transacciones.");
			setTransactions([]);
		} finally {
			setLoading(false);
		}
	};

	const fetchCampaignsByUser = async () => {
		if (!userId) return;
		setLoading(true);
		setError(null);
		try {
			const data = await fetchData(
				`${API_CAMPAIGNS}/users/${userId}/campaigns`,
			);
			setCampaigns(data || []);
		} catch (err) {
			handleApiError(err, "Error al cargar campañas.");
			setCampaigns([]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-6">
			<div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6">
				<h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
					Gestión de Datos
				</h1>
				{error && <p className="text-red-500 text-center mb-4">{error}</p>}
				{loading && (
					<p className="text-blue-500 text-center mb-4">Cargando...</p>
				)}
				<Tabs defaultValue="user">
					<TabsList className="mb-4 bg-gray-100 p-2 rounded-lg">
						<TabsTrigger
							value="user"
							className="px-4 py-2 rounded-md hover:bg-gray-200"
						>
							Usuario
						</TabsTrigger>
						<TabsTrigger
							value="transaction"
							className="px-4 py-2 rounded-md hover:bg-gray-200"
						>
							Transacción
						</TabsTrigger>
						<TabsTrigger
							value="campaigns"
							className="px-4 py-2 rounded-md hover:bg-gray-200"
						>
							Campañas
						</TabsTrigger>
					</TabsList>

					<TabsContent value="user">
						<Card className="bg-gray-50">
							<CardContent className="space-y-4 p-6">
								<div className="flex gap-4">
									<Input
										placeholder="Ingrese User ID"
										value={userId}
										onChange={(e) => setUserId(e.target.value)}
										className="flex-1 p-2 border border-gray-300 rounded-md"
									/>
									<Button
										onClick={fetchUserById}
										disabled={!userId || loading}
										className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
									>
										Buscar Usuario
									</Button>
								</div>

								{searchedUser && (
									<div className="space-y-6">
										<UserDetails user={searchedUser} />

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<div className="flex justify-between items-center mb-4">
													<h2 className="text-lg font-semibold text-gray-800">
														Cuentas
													</h2>
													<Button
														onClick={fetchAccounts}
														disabled={!userId || loading}
														className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
													>
														Cargar Cuentas
													</Button>
												</div>
												{accounts.length > 0 ? (
													<div>
														{accounts.map((acc) => (
															<AccountDetails key={acc.id} account={acc} />
														))}
													</div>
												) : (
													<p className="text-gray-500">No hay cuentas</p>
												)}
											</div>

											<div>
												<div className="flex justify-between items-center mb-4">
													<h2 className="text-lg font-semibold text-gray-800">
														Tarjetas de Crédito
													</h2>
													<Button
														onClick={fetchCreditCards}
														disabled={!userId || loading}
														className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
													>
														Cargar Tarjetas
													</Button>
												</div>
												{creditCards.length > 0 ? (
													<div>
														{creditCards.map((card) => (
															<CreditCardDetails key={card.id} card={card} />
														))}
													</div>
												) : (
													<p className="text-gray-500">
														No hay tarjetas de crédito
													</p>
												)}
											</div>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="transaction">
						<Card className="bg-gray-50">
							<CardContent className="space-y-4 p-6">
								<div className="flex gap-4">
									<Input
										placeholder="Ingrese Transaction ID"
										value={transactionId}
										onChange={(e) => setTransactionId(e.target.value)}
										className="flex-1 p-2 border border-gray-300 rounded-md"
									/>
									<Button
										onClick={fetchTransactionById}
										disabled={!transactionId || loading}
										className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
									>
										Buscar Transacción
									</Button>
								</div>
								{searchedTransaction && (
									<TransactionDetails transaction={searchedTransaction} />
								)}

								<div className="flex gap-4">
									<Input
										placeholder="Ingrese User ID"
										value={userId}
										onChange={(e) => setUserId(e.target.value)}
										className="flex-1 p-2 border border-gray-300 rounded-md"
									/>
									<Button
										onClick={fetchTransactionsByUser}
										disabled={!userId || loading}
										className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
									>
										Buscar Transacciones por Usuario
									</Button>
								</div>
								{transactions.length > 0 && (
									<div className="space-y-2">
										{transactions.map((t) => (
											<Card key={t.id} className="bg-gray-100">
												<CardContent>
													<TransactionDetails key={t.id} transaction={t} />
												</CardContent>
											</Card>
										))}
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="campaigns">
						<Card className="bg-gray-50">
							<CardContent className="space-y-4 p-6">
								<Button
									onClick={fetchCampaignsByUser}
									disabled={!userId || loading}
									className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
								>
									Cargar Campañas
								</Button>
								{campaigns.length > 0 ? (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{campaigns.map((c) => (
											<CampaignDetails key={c.id} campaign={c} />
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
		</div>
	);
};

export default UserTransactionCampaigns;
