import { screen } from "@testing-library/react";
import { Product } from "../../src/entities";
import { db } from "../mocks/db";
import { navigateTo } from "../utils";

describe("Router", () => {
  it("should render the home page for /", () => {
    navigateTo("/");

    expect(screen.getByRole("heading", { name: /home/i })).toBeInTheDocument();
  });
  it("should render the products page for /products", () => {
    navigateTo("/products");

    expect(
      screen.getByRole("heading", { name: /products/i })
    ).toBeInTheDocument();
  });
  it("should render the product details page for /products/:id", async () => {
    const product: Product = {
      id: 1,
      name: "Product 1",
      price: 100,
      categoryId: 1,
    };
    db.product.create(product);
    navigateTo("/products/ " + product.id);

    expect(await screen.findByRole("heading", { name: product.name }));

    db.product.delete({ where: { id: { equals: product.id } } });
  });
});
