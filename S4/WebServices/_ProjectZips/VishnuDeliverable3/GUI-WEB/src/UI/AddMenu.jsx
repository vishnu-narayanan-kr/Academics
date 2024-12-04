import "./AddMenu.css"

import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Input from "@mui/material/Input"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import { useRef } from "react"
import { postMenuApi } from "../APIs/menu"

export const AddMenu = ({ updateMenu }) => {
    const nameRef = useRef();
    const priceRef = useRef();
    const descRef = useRef();
    const cateRef = useRef();

    const addItem = async () => {
        const menu = {
            mealId: 0,
            mealName: nameRef.current.value,
            price: +priceRef.current.value,
            description: descRef.current.value,
            category: cateRef.current.value,
            restaurantId: 0,
            restaurantName: ""
        }

        await postMenuApi({ menu });
        updateMenu({});
    }

    return (
        <Container className="add-menu-container" maxWidth={false}>
            <h2>Add Menu</h2>
            <FormControl className="form-element">
                <InputLabel htmlFor="name">Name</InputLabel>
                <Input ref={nameRef} onChange={e => {nameRef.current.value = e.target.value}} id="name" aria-describedby="meal-name" />
            </FormControl>
            <FormControl className="form-element">
                <InputLabel htmlFor="price">Price</InputLabel>
                <Input ref={priceRef} onChange={e => {priceRef.current.value = e.target.value}} id="price" aria-describedby="price" />
            </FormControl>
            <FormControl className="form-element">
                <InputLabel htmlFor="description">Description</InputLabel>
                <Input ref={descRef} onChange={e => {descRef.current.value = e.target.value}} id="description" aria-describedby="meal-description" />
            </FormControl>
            <FormControl className="form-element">
                <InputLabel htmlFor="category">Category</InputLabel>
                <Select
                    ref={cateRef}
                    labelId="category"
                    id="category"
                    defaultValue={""}
                    label="Category"
                    onChange={(e) => {cateRef.current.value = e.target.value }}
                >
                    <MenuItem value={"main"}>Main Course</MenuItem>
                    <MenuItem value={"appetizer"}>Appetizer</MenuItem>
                    <MenuItem value={"side"}>Side</MenuItem>
                    <MenuItem value={"beverage"}>Beverage</MenuItem>
                </Select>
            </FormControl>
            <FormControl className="form-element">
                <Button variant="contained" color="success" onClick={() => addItem()}>
                    Add Item
                </Button>
            </FormControl>
        </Container>
    )
}