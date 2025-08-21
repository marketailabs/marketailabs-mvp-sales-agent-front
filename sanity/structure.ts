import {
  Users,
  Home,
  LayoutTemplate,
  CreditCard,
  FileText,
} from "lucide-react";
import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Dashboard")
    .items([
      // Home Section
      S.listItem()
        .title("Intro")
        .icon(Home)
        .child(S.documentTypeList("intro").title("Intro")),

      S.divider(),

      // Forms Section
      S.listItem()
        .title("Formularios")
        .icon(LayoutTemplate)
        .child(
          S.list()
            .title("Formularios")
            .items([
              S.listItem()
                .title("Formularios")
                .schemaType("form")
                .child(S.documentTypeList("form").title("Formularios")),
              S.listItem()
                .title("Campos de Entrada")
                .schemaType("input")
                .child(S.documentTypeList("input").title("Campos de Entrada")),
            ])
        ),

      S.divider(),

      // Plans Payment Section
      S.listItem()
        .title("Planes de Pago")
        .icon(CreditCard)
        .child(S.documentTypeList("plansPayment").title("Planes de Pago")),

      S.divider(),

      // Legal Section
      S.listItem()
        .title("Legal")
        .icon(FileText)
        .child(S.documentTypeList("legalSection").title("Secciones Legales")),

      S.divider(),

      // Users Section
      S.listItem()
        .title("Usuarios")
        .icon(Users)
        .child(
          S.documentTypeList("user")
            .title("Usuarios")
            .child((userId) =>
              S.document()
                .schemaType("user")
                .documentId(userId)
                .views([S.view.form()])
            )
        ),
    ]);
