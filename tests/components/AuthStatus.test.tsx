import { render, screen } from "@testing-library/react";
import AuthStatus from "../../src/components/AuthStatus";
import { mockAuthState } from "../utils";

describe("AuthStatus", () => {
  const renderComponent = () => {
    render(<AuthStatus />);
  };

  it("should render loading text when user is loading", () => {
    mockAuthState({
      isLoading: true,
      isAuthenticated: false,
      user: undefined,
    });
    renderComponent();

    expect(screen.queryByText(/loading/i)).toBeInTheDocument();
  });

  it("should render user name and logout button when user is authenticated", () => {
    const user = { name: "Max" };
    mockAuthState({
      isLoading: false,
      isAuthenticated: true,
      user,
    });
    renderComponent();

    expect(screen.queryByText(user.name)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /log out/i })
    ).toBeInTheDocument();
  });

  it("should render login button when user is not authenticated", () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: false,
      user: undefined,
    });
    renderComponent();

    expect(
      screen.queryByRole("button", { name: /log in/i })
    ).toBeInTheDocument();
  });
});
