import { type Meta, type StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  Navbar,
  NavLogo,
  NavGroup,
  NavItem,
  NavActions,
} from "../components/navigation/Navbar";
import { MobileDrawer } from "../components/navigation/MobileDrawer";
import { Button } from "../components/Button";
import { Menu } from "lucide-react";

const meta: Meta<typeof Navbar> = {
  component: Navbar,
  title: "Navigation/Navbar",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof Navbar>;

const navItems = (
  <>
    <NavItem label="Home" href="#" />
    <NavItem label="About" href="#" />
    <NavItem label="Blog" href="#" />
  </>
);

export const LoggedOut: Story = {
  render: () => (
    <Navbar>
      <NavLogo />
      <NavGroup>{navItems}</NavGroup>
      <NavActions isLoggedIn={false} />
    </Navbar>
  ),
};

export const LoggedIn: Story = {
  render: () => (
    <Navbar>
      <NavLogo />
      <NavGroup>{navItems}</NavGroup>
      <NavActions isLoggedIn={true} />
    </Navbar>
  ),
};

export const WithCustomLogo: Story = {
  render: () => (
    <Navbar>
      <NavLogo name="MyApp" />
      <NavGroup>
        <NavItem label="Features" href="#" />
        <NavItem label="Pricing" href="#" />
        <NavItem label="Docs" href="#" />
      </NavGroup>
      <NavActions isLoggedIn={false} />
    </Navbar>
  ),
};

export const WithImageLogo: Story = {
  render: () => (
    <Navbar>
      <NavLogo logo="https://placehold.co/80x32/0e7490/white?text=Logo" />
      <NavGroup>{navItems}</NavGroup>
      <NavActions isLoggedIn={false} />
    </Navbar>
  ),
};

const NavbarWithDrawer = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Navbar>
        <NavLogo />
        <NavGroup>{navItems}</NavGroup>
        <div className="flex items-center gap-3">
          <NavActions isLoggedIn={isLoggedIn} />
          {/* Mobile menu button — visible only on small screens */}
          <button
            className="md:hidden p-2 text-ui-secondary hover:text-ui-primary transition-colors"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </Navbar>

      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <NavItem label="Home" href="#" />
        <NavItem label="About" href="#" />
        <NavItem label="Blog" href="#" />
        <div className="flex flex-col gap-3 pt-4 border-t border-ui-border">
          {isLoggedIn ? (
            <Button size="sm" variant="outline">
              Profile
            </Button>
          ) : (
            <>
              <Button size="sm" variant="outline">
                Log in
              </Button>
              <Button size="sm" variant="outline">
                Sign up
              </Button>
            </>
          )}
        </div>
      </MobileDrawer>
    </>
  );
};

export const WithMobileDrawer: Story = {
  render: () => <NavbarWithDrawer isLoggedIn={false} />,
};

export const WithMobileDrawerLoggedIn: Story = {
  render: () => <NavbarWithDrawer isLoggedIn={true} />,
};
