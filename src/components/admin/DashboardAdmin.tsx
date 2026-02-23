import HeaderSection from "../commons/HeaderSection";

type Props = {
  usr: string;
  onLogout: () => void;
};

function DashboardAdmin({ usr, onLogout }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <HeaderSection title="Dashboard" />

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Hai {usr} 👋</h1>

        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
        >
          Logout
        </button>
      </div>

      <p>Apa kabarmu hari ini?</p>
    </div>
  );
}

export default DashboardAdmin;
