export default function PendientePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icono */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center">
            <span className="text-4xl">⏳</span>
          </div>
        </div>

        {/* Texto */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">
            Acceso pendiente
          </h1>
          <p className="text-gray-400">
            Tu cuenta está esperando aprobación. Una vez que confirmes tu inscripción, el administrador activará tu acceso.
          </p>
        </div>

        {/* Contacto */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-1">
          <p className="text-sm text-gray-500">¿Ya pagaste? Contacta al admin:</p>
          <a
            className="text-yellow-400 font-medium"
          >
            Aldair Portilla 
            0995549223
        
          </a>
        </div>

        {/* Logout */}
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="text-sm text-gray-500 hover:text-gray-300 underline"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  );
}