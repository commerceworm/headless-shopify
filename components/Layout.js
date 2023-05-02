import Header from "./Header"
import Footer from "./Footer"

const Layout = ({ children }) => (
  <div>
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
)

export default Layout
