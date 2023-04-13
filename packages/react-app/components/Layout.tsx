import { FC, ReactNode } from "react";
import ComputerModal from "./ComputerModal";
import Header from "./Header";



interface Props {
    children: ReactNode
}
const Layout: FC<Props> = ({children}) => {
    return (
      <>
        <div
          data-theme="cupcake"
          className="bg-gypsum overflow-hidden flex flex-col min-h-screen"
        >
          <Header />
          <div className="py-16 max-w-7xl mx-auto space-y-8 sm:px-6 lg:px-8">
            <ComputerModal />
            {children}
          </div>
        </div>
      </>
    );
}

export default Layout;