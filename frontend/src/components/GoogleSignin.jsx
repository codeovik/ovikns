const GoogleSignIn = () => {
    return (
        <a href={`${import.meta.env.VITE_BACKEND_DOMAIN}/api/v1/auth/google`} className="flex gap-2 justify-center items-center rounded-md bg-box-secondary hover:bg-box-tertiary transition-all px-3 py-2.5 cursor-pointer">
            <img src="https://ovikbiswas.wordpress.com/wp-content/uploads/2025/12/google.webp" alt="Google Logo" className="h-5 w-5" />
            <p className="w-max text-center">
                Continue with Google
            </p>
        </a>
    );
};

export default GoogleSignIn;