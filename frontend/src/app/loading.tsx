import { FullPageLoader } from "@/shared/ux/components/full-page-loader";
import { ru } from "@/shared/i18n";

export default function Loading() {
  return <FullPageLoader message={ru.errors.loadingApp} />;
}
