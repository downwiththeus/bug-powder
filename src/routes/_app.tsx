import { createFileRoute } from "@tanstack/react-router";
import { InterzoneLayout } from "@/components/InterzoneLayout";

export const Route = createFileRoute("/_app")({
  component: InterzoneLayout,
});
