import logo from './logo.svg';
import './App.css';
import {SnackbarProvider} from "notistack";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import OrdersList from "./component/ListOrders";
import OrderCreate from "./component/Create";
import UpdateOrder from "./component/Update";
import Detail from "./component/Detail";

function App() {
  return (
      <SnackbarProvider maxSnack={3} autoHideDuration={3001}>
        <BrowserRouter>
          <Routes>
            <Route path="orders" element={<OrdersList/>}></Route>
            <Route path="orders/create" element={<OrderCreate/>}></Route>
            <Route path="orders/:id/update" element={<UpdateOrder/>}></Route>
            <Route path="orders/:id" element={<Detail/>}></Route>
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
  );
}

export default App;
