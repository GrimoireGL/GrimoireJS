
import GrimoireInitializer from "./Core/GrimoireInitializer";
import GrimoireInterface from "./Core/GrimoireInterface";

/**
 * Just start the process.
 */
export default function(): typeof GrimoireInterface {
  GrimoireInitializer.initialize(GrimoireInterface);
  return GrimoireInterface;
}
