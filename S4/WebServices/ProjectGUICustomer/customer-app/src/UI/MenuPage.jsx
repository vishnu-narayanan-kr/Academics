import "./MenuPage.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCart } from './useCart';

export const MenuPage = () => {
    const [menuData, setMenuData] = useState([]);
    const inputRef = useRef(null);

    const [cart, updateCartItems] = useCart();

    const fetchData = useCallback(async ({ keyword = '' }) => {
        const apiUrl = 'http://localhost:8080/WebOnlineFoodDeliveryServiceProject/rest/Menu/View?keyword=' + keyword;
    
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const dataArr = [];
    
            for(const key in data) {
                dataArr.push(data[key]);
            }
    
            setMenuData(dataArr);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
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
    
    return (
        <div>
            <div>
                <label>Enter keyword to search:</label>
                <input ref={inputRef} />
                <button onClick={showInputValue}>Search</button>
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

