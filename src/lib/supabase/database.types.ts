export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      accounts_payable: {
        Row: {
          amount: number
          created_at: string
          description: string
          due_date: string
          id: string
          notes: string | null
          paid_date: string | null
          status: Database["public"]["Enums"]["finance_status"]
          supplier_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          due_date: string
          id?: string
          notes?: string | null
          paid_date?: string | null
          status?: Database["public"]["Enums"]["finance_status"]
          supplier_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          due_date?: string
          id?: string
          notes?: string | null
          paid_date?: string | null
          status?: Database["public"]["Enums"]["finance_status"]
          supplier_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_payable_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts_receivable: {
        Row: {
          amount: number
          client_id: string
          created_at: string
          description: string
          due_date: string
          id: string
          notes: string | null
          order_id: string | null
          paid_date: string | null
          quote_id: string | null
          status: Database["public"]["Enums"]["finance_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          client_id: string
          created_at?: string
          description: string
          due_date: string
          id?: string
          notes?: string | null
          order_id?: string | null
          paid_date?: string | null
          quote_id?: string | null
          status?: Database["public"]["Enums"]["finance_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string
          description?: string
          due_date?: string
          id?: string
          notes?: string | null
          order_id?: string | null
          paid_date?: string | null
          quote_id?: string | null
          status?: Database["public"]["Enums"]["finance_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_receivable_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_receivable_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_receivable_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_logs: {
        Row: {
          action: string
          actor_id: string | null
          actor_name: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json
          summary: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_name?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json
          summary?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_name?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json
          summary?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          city: string | null
          contact_name: string | null
          created_at: string
          document: string | null
          email: string | null
          id: string
          legal_name: string
          notes: string | null
          phone: string | null
          trade_name: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_name?: string | null
          created_at?: string
          document?: string | null
          email?: string | null
          id?: string
          legal_name: string
          notes?: string | null
          phone?: string | null
          trade_name?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_name?: string | null
          created_at?: string
          document?: string | null
          email?: string | null
          id?: string
          legal_name?: string
          notes?: string | null
          phone?: string | null
          trade_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          address: string | null
          created_at: string
          document: string | null
          email: string | null
          id: number
          legal_name: string
          logo_url: string | null
          phone: string | null
          quote_default_payment_terms: string | null
          quote_default_validity_days: number
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          document?: string | null
          email?: string | null
          id?: number
          legal_name: string
          logo_url?: string | null
          phone?: string | null
          quote_default_payment_terms?: string | null
          quote_default_validity_days?: number
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          document?: string | null
          email?: string | null
          id?: number
          legal_name?: string
          logo_url?: string | null
          phone?: string | null
          quote_default_payment_terms?: string | null
          quote_default_validity_days?: number
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      molds: {
        Row: {
          application: string | null
          cavities: number | null
          client_id: string
          code: string
          created_at: string
          description: string | null
          id: string
          name: string | null
          notes: string | null
          type: Database["public"]["Enums"]["mold_type"] | null
          updated_at: string
        }
        Insert: {
          application?: string | null
          cavities?: number | null
          client_id: string
          code: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          type?: Database["public"]["Enums"]["mold_type"] | null
          updated_at?: string
        }
        Update: {
          application?: string | null
          cavities?: number | null
          client_id?: string
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          type?: Database["public"]["Enums"]["mold_type"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "molds_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          archived: boolean
          client_id: string
          created_at: string
          id: string
          mold_id: string | null
          notes: string | null
          number: string
          quote_id: string | null
          status: Database["public"]["Enums"]["order_status"]
          total: number
          updated_at: string
        }
        Insert: {
          archived?: boolean
          client_id: string
          created_at?: string
          id?: string
          mold_id?: string | null
          notes?: string | null
          number: string
          quote_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total?: number
          updated_at?: string
        }
        Update: {
          archived?: boolean
          client_id?: string
          created_at?: string
          id?: string
          mold_id?: string | null
          notes?: string | null
          number?: string
          quote_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_mold_id_fkey"
            columns: ["mold_id"]
            isOneToOne: false
            referencedRelation: "molds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      quote_items: {
        Row: {
          description: string
          id: string
          quantity: number
          quote_id: string
          sort_order: number
          total: number
          unit_price: number
        }
        Insert: {
          description: string
          id?: string
          quantity?: number
          quote_id: string
          sort_order?: number
          total?: number
          unit_price?: number
        }
        Update: {
          description?: string
          id?: string
          quantity?: number
          quote_id?: string
          sort_order?: number
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          archived: boolean
          client_id: string
          created_at: string
          created_by: string | null
          deadline: string | null
          description: string | null
          discount: number
          freight: string | null
          id: string
          mold_id: string | null
          notes: string | null
          number: string
          payment_terms: string | null
          responsible: string | null
          service_type: Database["public"]["Enums"]["service_type"] | null
          share_token: string
          status: Database["public"]["Enums"]["quote_status"]
          subtotal: number
          total: number
          updated_at: string
          validity_date: string | null
        }
        Insert: {
          archived?: boolean
          client_id: string
          created_at?: string
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          discount?: number
          freight?: string | null
          id?: string
          mold_id?: string | null
          notes?: string | null
          number: string
          payment_terms?: string | null
          responsible?: string | null
          service_type?: Database["public"]["Enums"]["service_type"] | null
          share_token?: string
          status?: Database["public"]["Enums"]["quote_status"]
          subtotal?: number
          total?: number
          updated_at?: string
          validity_date?: string | null
        }
        Update: {
          archived?: boolean
          client_id?: string
          created_at?: string
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          discount?: number
          freight?: string | null
          id?: string
          mold_id?: string | null
          notes?: string | null
          number?: string
          payment_terms?: string | null
          responsible?: string | null
          service_type?: Database["public"]["Enums"]["service_type"] | null
          share_token?: string
          status?: Database["public"]["Enums"]["quote_status"]
          subtotal?: number
          total?: number
          updated_at?: string
          validity_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_mold_id_fkey"
            columns: ["mold_id"]
            isOneToOne: false
            referencedRelation: "molds"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          expected_delivery_date: string | null
          id: string
          mold_id: string | null
          notes: string | null
          quote_id: string | null
          responsible: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["service_status"]
          title: string
          type: Database["public"]["Enums"]["service_type"]
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          expected_delivery_date?: string | null
          id?: string
          mold_id?: string | null
          notes?: string | null
          quote_id?: string | null
          responsible?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["service_status"]
          title: string
          type?: Database["public"]["Enums"]["service_type"]
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          expected_delivery_date?: string | null
          id?: string
          mold_id?: string | null
          notes?: string | null
          quote_id?: string | null
          responsible?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["service_status"]
          title?: string
          type?: Database["public"]["Enums"]["service_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_mold_id_fkey"
            columns: ["mold_id"]
            isOneToOne: false
            referencedRelation: "molds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          company_name: string
          contact_name: string | null
          created_at: string
          document: string | null
          email: string | null
          id: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          company_name: string
          contact_name?: string | null
          created_at?: string
          document?: string | null
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          company_name?: string
          contact_name?: string | null
          created_at?: string
          document?: string | null
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_accounts_payable: {
        Row: {
          amount: number | null
          created_at: string | null
          description: string | null
          due_date: string | null
          effective_status: Database["public"]["Enums"]["finance_status"] | null
          id: string | null
          notes: string | null
          paid_date: string | null
          status: Database["public"]["Enums"]["finance_status"] | null
          supplier_id: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_payable_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      v_accounts_receivable: {
        Row: {
          amount: number | null
          client_id: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          effective_status: Database["public"]["Enums"]["finance_status"] | null
          id: string | null
          notes: string | null
          paid_date: string | null
          quote_id: string | null
          status: Database["public"]["Enums"]["finance_status"] | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_receivable_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_receivable_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      approve_public_quote: { Args: { p_token: string }; Returns: boolean }
      create_quote: { Args: { items: Json; p: Json }; Returns: string }
      duplicate_quote: { Args: { p_source: string }; Returns: string }
      get_public_quote: { Args: { p_token: string }; Returns: Json }
      recalc_quote_totals: { Args: { p_quote_id: string }; Returns: undefined }
      update_quote: {
        Args: { items: Json; p: Json; p_id: string }
        Returns: string
      }
    }
    Enums: {
      finance_status: "open" | "paid" | "overdue" | "cancelled"
      mold_type: "single_cavity" | "multi_cavity"
      order_status: "open" | "completed" | "cancelled"
      quote_status:
        | "draft"
        | "sent"
        | "approved"
        | "rejected"
        | "expired"
        | "cancelled"
      service_status:
        | "waiting"
        | "analysis"
        | "in_progress"
        | "waiting_client"
        | "completed"
        | "delivered"
        | "cancelled"
      service_type:
        | "construction"
        | "maintenance"
        | "alteration"
        | "machining"
        | "other"
      user_role: "admin" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      finance_status: ["open", "paid", "overdue", "cancelled"],
      mold_type: ["single_cavity", "multi_cavity"],
      order_status: ["open", "completed", "cancelled"],
      quote_status: [
        "draft",
        "sent",
        "approved",
        "rejected",
        "expired",
        "cancelled",
      ],
      service_status: [
        "waiting",
        "analysis",
        "in_progress",
        "waiting_client",
        "completed",
        "delivered",
        "cancelled",
      ],
      service_type: [
        "construction",
        "maintenance",
        "alteration",
        "machining",
        "other",
      ],
      user_role: ["admin", "member"],
    },
  },
} as const
