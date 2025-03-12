import {BrowserRouter,Routes,Route} from 'react-router-dom';
import {LoginPage,SignupPage, Homepage, ProductForm, EditProduct, ProductInfoPage} from './Routes.jsx'
 
 
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Homepage/>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/add-product" element={<ProductForm/>} />
      <Route path="/edit-product/:id" element={<EditProduct/>} /> 
      <Route path="/products/:id" element={<ProductInfoPage/>}/>
    </Routes>
    </BrowserRouter>
 
  );
}
 
export default App;
 