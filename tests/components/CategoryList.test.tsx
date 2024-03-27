import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import CategoryList from "../../src/components/CategoryList";
import { Category } from "../../src/entities";
import ReduxProvider from "../../src/providers/ReduxProvider";
import { db } from "../mocks/db";
import { simulateDelay, simulateError } from "../utils";

describe("CategoryList", () => {
  const categories: Category[] = [];

  beforeAll(() => {
    [1, 2].forEach(() => {
      const category = db.category.create();
      categories.push(category);
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((category) => category.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });
  });

  const renderComponent = () => {
    render(
      <ReduxProvider>
        <CategoryList />
      </ReduxProvider>
    );
  };

  it("should render list of categories", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    categories.forEach((category) => {
      const categoryElement = screen.getByText(category.name);
      expect(categoryElement).toBeInTheDocument();
    });
  });

  it("should render loading text when categories are loading", () => {
    simulateDelay("/categories");
    renderComponent();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render error text when categories failed to load", async () => {
    simulateError("/categories");

    renderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
