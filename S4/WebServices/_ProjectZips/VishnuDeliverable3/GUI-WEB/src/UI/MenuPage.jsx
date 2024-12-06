import "./MenuPage.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCart } from './useCart';
import { getMenusApi } from "../APIs/menu";
import { useNavigate } from "react-router";

export const MenuPage = () => {
    const [menuData, setMenuData] = useState([]);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    const [cart, updateCartItems] = useCart();

    const fetchData = useCallback(async ({ keyword = '' }) => {
        const menuArr = await getMenusApi({ keyword });
        setMenuData(menuArr);
    }, [setMenuData]);

    useEffect(() => {
        fetchData({});
    }, [setMenuData]);

    const header = useMemo(() => (
        <thead>
            <tr>{["ID", "Name", "Price", "Description", "Category", "Action"].map(s => <th key={s}>{s}</th>)}</tr>
        </thead>
        ), []);

    const body = useMemo(() => (
        <tbody>
            {console.count("Menu Re-Render")}
            {   
                menuData.map((item) => {
                    const { mealId, mealName, price, description, category } = item;

                    return (
                        <tr key={mealId}>
                            <td>{mealId}</td>
                            <td>{mealName}</td>
                            <td>{price}</td>
                            <td>{description}</td>
                            <td>{category}</td>
                            <td><button onClick={() => updateCartItems(item)}>Add to Cart</button></td>
                        </tr>
                    )
                })
            }
        </tbody>
    ), [menuData, updateCartItems]);

    const showInputValue = useCallback(() => {
        const keyword = inputRef.current.value;
        fetchData({ keyword });
    }, []);
    
    const viewOrders = () => {
        navigate("/ViewOrders");
    }

    return (
        <div>
            <div>
                <label>Enter keyword to search:</label>
                <input ref={inputRef} />
                <button onClick={showInputValue}>Search</button>
                <button onClick={viewOrders}>View Orders</button>
            </div>
            <div className="table-container">
                <div className="menu-table-wrapper">
                    <table>
                        {header}
                        {body}
                    </table>
                </div>
                {cart}
            </div>
        </div>
    );
}

