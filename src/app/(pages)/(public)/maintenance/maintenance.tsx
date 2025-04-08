import Head from 'next/head';

export default function MaintenancePage() {
  return (
    <>
      <Head>
        <title>Site em Manutenção</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Voltamos em breve!</h1>
        <p className="text-lg text-gray-600 max-w-md">
          Estamos realizando uma manutenção programada para melhorar sua experiência. 
          Obrigado pela paciência!
        </p>
      </div>
    </>
  );
}
