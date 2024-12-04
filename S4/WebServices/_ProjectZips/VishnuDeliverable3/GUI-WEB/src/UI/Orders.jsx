import { Auth } from "../Context/AuthContext";
import "./Orders.css";

import { useCallback, useState, useEffect, useContext } from "react";

export const Orders = () => {
    const [orderData, setOrderData] = useState([]);
    const { authUser } = useContext(Auth); 

    const fetchData = useCallback(async() => {
        const apiUrl = 'http://localhost:8080/WebOnlineFoodDeliveryServiceProject/rest/Order/View?username=' + authUser.username;
    
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
    
            setOrderData(dataArr);
            console.log(dataArr)
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }, [setOrderData]);

    useEffect(() => {
        fetchData();
    }, [setOrderData]);

    const orderItemRow = (item) => {
        const { mealId, mealName, price, qty } = item;

        return (
            <tr key={mealId}>
                <td>{mealName}</td>
                <td>{price}</td>
                <td>{qty}</td>
            </tr>
        );
    }

    const orders = orderData.map(order => {
        const {orderId, total, items} = order;

        const orderItemRows = items.map(orderItemRow);
        const orderItemHeaders = (
            <thead>
                <tr>
                    {
                        ["Item Name", "Price in CAD", "Quantity"].map(heading => {
                            return <th key={heading}>{heading}</th>;
                        })
                    }
                </tr>
            </thead>
        )

        return (
            <div key={orderId} className="order">
                <div><b>Order ID:</b> {orderId}, <b>Total:</b> {total}</div>
                <table>
                    {orderItemHeaders}
                    <tbody>
                        {orderItemRows}
                    </tbody>
                </table>
            </div>
        );
    });

    return (
        <div className="order-page">
            {orders}
        </div>
    );
}