import { Auth } from "../Context/AuthContext";
import "./Cart.css";

import { useCallback, useContext, useMemo, useState } from "react";

export const useCart = () => {
    const [items, setItems] = useState([]);
    const { authUser } = useContext(Auth);

    const updateCartItems = useCallback((item) => {
        const existingItem = items.find(({ mealId }) => mealId === item.mealId);

        if(!existingItem) {
            setItems(prevItems => [...prevItems, { ...item, qty: 1}]);
        }
    }, [items, setItems]);

    const header = useMemo(() => (
        <thead>
            <tr>{["ID", "Name", "Price", "Action", "SubTotal"].map(s => <th key={s}>{s}</th>)}</tr>
        </thead>
    ), []);

    const addRemoveItem = useCallback(({ action, mealId }) => {
        let item = {...items.find(({ mealId: id }) => id === mealId)};

        if(action === "add") {
            item.qty++;
        } else {
            item.qty--;

            if(item.qty === 0) {
                setItems(prevItems => [...prevItems.filter(({ mealId: id }) => id !== mealId)])
                return;
            }
        }

        setItems(prevItems => {
            const indexOfItem = prevItems.findIndex(({ mealId: id }) => id === mealId);
            const newItems = [...prevItems];
            newItems[indexOfItem] = {...item};
            return newItems;
        });
    }, [items, setItems]);

    const body = useMemo(() => (
        <tbody>
            {console.count("Cart Re-Render")}
            {
                items.map(({ mealId, mealName, price, qty}) => (
                    <tr key={mealId}>
                        <td>{mealId}</td>
                        <td>{mealName}</td>
                        <td>{price}</td>
                        <td>
                            <button onClick={() => addRemoveItem({ action: 'remove', mealId })}>-</button>
                            <span>{qty}</span>
                            <button onClick={() => addRemoveItem({ action: 'add', mealId })}>+</button>
                        </td>
                        <td>{(qty * price).toFixed(2)}$</td>
                    </tr>
                ))
            }
        </tbody>
    ), [items]);

    const total = useMemo(() => items
        .map(({ qty, price }) => (qty * price))
        .reduce((p, c) => p + c, 0), [items])
        .toFixed(2);

    const onConfirmOrder = useCallback(async () => {
        if(!items.length) return;
        
        const url = "http://localhost:8080/WebOnlineFoodDeliveryServiceProject/rest/Order/Place";

        const data = {
            username: authUser.username,
            items
        };

        try {
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            });
        
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
        
            const result = await response.json();
            alert(`Order ${result.orderId} Confirmed: Please Navigate to Order History to see past orders.`);
            console.log('Success:', result);
          } catch (error) {
            console.error('Error:', error);
          }

    }, [items]);

    const cart = (
            <div className="cart-container">
                <h2>Your Cart</h2>
                <table>
                    {header}
                    {body}
                </table>
                <p>The total is: <b>{total}$</b></p>
                <div className="cart-buttons">
                    <button onClick={onConfirmOrder}>Confirm Order!</button>
                    <button onClick={() => setItems([])}>Clear Cart</button>
                </div>
            </div>
    );

    return [cart, updateCartItems];
}