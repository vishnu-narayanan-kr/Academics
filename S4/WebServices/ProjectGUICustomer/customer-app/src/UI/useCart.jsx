import "./Cart.css";

import { useCallback, useMemo, useState } from "react";

export const useCart = () => {
    const [items, setItems] = useState([]);

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

    const cart = (
            <div className="cart-container">
                <table>
                    {header}
                    {body}
                </table>
                <p>The total is: <b>{total}$</b></p>
                <button>Confirm Order!</button>
            </div>
    );

    return [cart, updateCartItems];
}