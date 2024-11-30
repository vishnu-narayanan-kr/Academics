import "./ManageMenus.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deleteMenuApi, getMenusApi, putMenuApi } from "../APIs/menu";
import { AddMenu } from "./AddMenu";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";

export const ManageMenus = () => {
    const [menuData, setMenuData] = useState([]);
    const inputRef = useRef(null);

    const selectRowRef = useRef({
        mealId: 0,
        mealName: "",
        price: 0,
        description: "",
        category: "",
        restaurantId: 0,
        restaurantName: ""
    });

    const fetchData = useCallback(async ({ keyword = '' }) => {
        const menuArr = await getMenusApi({ keyword });
        setMenuData(menuArr);
    }, [setMenuData]);

    useEffect(() => {
        fetchData({});
    }, [setMenuData]);

    const onDelete = async (id) => {
        await deleteMenuApi(id);
        fetchData({});
    }

    const onRowFocus = (id) => {
        selectRowRef.current = menuData.find(menu => menu.mealId === id);
        console.log(selectRowRef.current)
    }

    const onUpdate = async () => {
        await putMenuApi({ menu: selectRowRef.current })
    }

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
                        <tr key={mealId} onClick={() => onRowFocus(mealId)}>
                            <td><Input value={mealId}  disabled className="id-input"/></td>
                            <td>
                                <Input 
                                    defaultValue={mealName}
                                    className="name-input"
                                    onChange={(e) => {selectRowRef.current.mealName = e.target.value}}/>
                            </td>
                            <td>
                                <Input defaultValue={price} className="price-input" onChange={(e) => {selectRowRef.current.price = +e.target.value}}/>
                            </td>
                            <td>
                                <Input defaultValue={description}  className="desc-input" onChange={(e) => {selectRowRef.current.description = e.target.value}}/>
                            </td>
                            <td>
                                <Input defaultValue={category} className="category-input" onChange={(e) => {selectRowRef.current.category = e.target.value}}/>
                            </td>
                            <td>
                                <Button color="warning" onClick={onUpdate}>Update</Button>
                                <Button color="error" onClick={() => onDelete(mealId)}>Delete</Button>
                            </td>
                        </tr>
                    )
                })
            }
        </tbody>
    ), [menuData]);

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
                <AddMenu updateMenu={fetchData}/>
            </div>
        </div>
    );
}