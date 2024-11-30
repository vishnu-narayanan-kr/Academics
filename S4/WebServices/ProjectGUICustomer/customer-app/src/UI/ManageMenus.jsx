import "./ManageMenus.css";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deleteMenuApi, getMenusApi } from "../APIs/menu";
import { AddMenu } from "./AddMenu";
import Button from "@mui/material/Button";
import { Input } from "@mui/material";

export const ManageMenus = () => {
    const [menuData, setMenuData] = useState([]);
    const inputRef = useRef(null);

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
                            <td>
                                <Input value={mealName}/>
                            </td>
                            <td>
                                <Input value={price} className="price-input"/>
                            </td>
                            <td>
                                <Input value={description}/>
                            </td>
                            <td>
                                <Input value={category}/>
                            </td>
                            <td>
                                <Button color="warning">Update</Button>
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