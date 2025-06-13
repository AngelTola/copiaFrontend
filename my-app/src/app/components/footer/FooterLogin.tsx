export default function Footer() {
    return (
      <footer className="bg-[var(--hueso)] text-[var(--negro)] font-[var(--fuente-principal)] border-t-[1px] border-[rgba(0,0,0,0.2)] p-8 text-right rounded-t-[20px]">
        <a
          href="/home/homePage/terminosLogin"
          className="underline cursor-pointer text-[rgba(0,0,0,0.64)]"
        >
          Términos y condiciones
        </a>
      </footer>
    );
  }