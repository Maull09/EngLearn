import Image from "next/image";

type HeaderProps = {
  title: string;
  userName: string;
  profileImageSrc: string;
};

export const Header = ({ title, userName, profileImageSrc }: HeaderProps) => {
  return (
    <div className="sticky top-0 mb-5 flex items-center justify-between border-b-2 bg-white pb-3 px-6 text-neutral-400 lg:z-50 lg:mt-[-28px] lg:pt-[28px]">
      <Image
        src="/united-kingdom.png"
        alt="Logo"
        width={32}
        height={32}
      />
      <h1 className="text-lg font-bold flex-1 text-center">{title}</h1>
      
      <div className="flex items-center">
        <Image
              src={profileImageSrc || "/book_5221784.png"}
              alt={userName}
              className="rounded-md border"
              width={32}
              height={32}
            />
        <span className="ml-2 font-semibold">{userName}</span>
      </div>
    </div>
  );
};
