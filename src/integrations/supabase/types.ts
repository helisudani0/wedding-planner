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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          actor_id: string | null
          actor_name: string
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_name: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_name?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
        }
        Relationships: []
      }
      budget_settings: {
        Row: {
          id: string
          total_budget: number
          updated_at: string
        }
        Insert: {
          id?: string
          total_budget?: number
          updated_at?: string
        }
        Update: {
          id?: string
          total_budget?: number
          updated_at?: string
        }
        Relationships: []
      }
      catering: {
        Row: {
          created_at: string
          guest_count: number
          id: string
          meal_date: string | null
          meal_name: string
          meal_type: string
          menu: string | null
          notes: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          guest_count?: number
          id?: string
          meal_date?: string | null
          meal_name: string
          meal_type?: string
          menu?: string | null
          notes?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          guest_count?: number
          id?: string
          meal_date?: string | null
          meal_name?: string
          meal_type?: string
          menu?: string | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      checklists: {
        Row: {
          assigned_to: string | null
          created_at: string
          done: boolean
          extra: string | null
          group_name: string | null
          id: string
          kind: string
          notes: string | null
          quantity: number | null
          sort_order: number
          title: string
          title_gu: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          done?: boolean
          extra?: string | null
          group_name?: string | null
          id?: string
          kind: string
          notes?: string | null
          quantity?: number | null
          sort_order?: number
          title: string
          title_gu?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          done?: boolean
          extra?: string | null
          group_name?: string | null
          id?: string
          kind?: string
          notes?: string | null
          quantity?: number | null
          sort_order?: number
          title?: string
          title_gu?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          author_id: string | null
          author_name: string
          body: string
          created_at: string
          entity_id: string
          entity_type: string
          id: string
        }
        Insert: {
          author_id?: string | null
          author_name: string
          body: string
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string
          body?: string
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          created_at: string
          emergency: boolean
          id: string
          name: string
          notes: string | null
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          emergency?: boolean
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          emergency?: boolean
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string
          created_at: string
          event_id: string | null
          file_type: string | null
          file_url: string
          id: string
          notes: string | null
          title: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          event_id?: string | null
          file_type?: string | null
          file_url: string
          id?: string
          notes?: string | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          event_id?: string | null
          file_type?: string | null
          file_url?: string
          id?: string
          notes?: string | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          budget: number | null
          created_at: string
          date_fixed: boolean
          decoration_notes: string | null
          event_date: string | null
          event_time: string | null
          food_notes: string | null
          guest_count: number | null
          id: string
          name: string
          name_gu: string | null
          notes: string | null
          responsible: string | null
          sort_order: number
          updated_at: string
          venue: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string
          date_fixed?: boolean
          decoration_notes?: string | null
          event_date?: string | null
          event_time?: string | null
          food_notes?: string | null
          guest_count?: number | null
          id?: string
          name: string
          name_gu?: string | null
          notes?: string | null
          responsible?: string | null
          sort_order?: number
          updated_at?: string
          venue?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string
          date_fixed?: boolean
          decoration_notes?: string | null
          event_date?: string | null
          event_time?: string | null
          food_notes?: string | null
          guest_count?: number | null
          id?: string
          name?: string
          name_gu?: string | null
          notes?: string | null
          responsible?: string | null
          sort_order?: number
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          created_by: string | null
          due_date: string | null
          id: string
          notes: string | null
          paid: boolean
          paid_on: string | null
          receipt_url: string | null
          title: string
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          paid?: boolean
          paid_on?: string | null
          receipt_url?: string | null
          title: string
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          paid?: boolean
          paid_on?: string | null
          receipt_url?: string | null
          title?: string
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: []
      }
      gallery: {
        Row: {
          caption: string | null
          created_at: string
          favourite: boolean
          file_type: string | null
          file_url: string
          function_name: string
          id: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          favourite?: boolean
          file_type?: string | null
          file_url: string
          function_name?: string
          id?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          favourite?: boolean
          file_type?: string | null
          file_url?: string
          function_name?: string
          id?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      guests: {
        Row: {
          address: string | null
          card_printed: boolean
          coming: string | null
          created_at: string
          family_name: string | null
          food_preference: string | null
          guest_count: number
          hotel_needed: boolean
          id: string
          invitation_given: boolean
          name: string
          notes: string | null
          phone: string | null
          reminder_sent: boolean
          side: string | null
          transport_needed: boolean
          updated_at: string
          whatsapp_sent: boolean
        }
        Insert: {
          address?: string | null
          card_printed?: boolean
          coming?: string | null
          created_at?: string
          family_name?: string | null
          food_preference?: string | null
          guest_count?: number
          hotel_needed?: boolean
          id?: string
          invitation_given?: boolean
          name: string
          notes?: string | null
          phone?: string | null
          reminder_sent?: boolean
          side?: string | null
          transport_needed?: boolean
          updated_at?: string
          whatsapp_sent?: boolean
        }
        Update: {
          address?: string | null
          card_printed?: boolean
          coming?: string | null
          created_at?: string
          family_name?: string | null
          food_preference?: string | null
          guest_count?: number
          hotel_needed?: boolean
          id?: string
          invitation_given?: boolean
          name?: string
          notes?: string | null
          phone?: string | null
          reminder_sent?: boolean
          side?: string | null
          transport_needed?: boolean
          updated_at?: string
          whatsapp_sent?: boolean
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string | null
          created_at: string
          file_url: string | null
          id: string
          sender_id: string | null
          sender_name: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          file_url?: string | null
          id?: string
          sender_id?: string | null
          sender_name: string
        }
        Update: {
          body?: string | null
          created_at?: string
          file_url?: string | null
          id?: string
          sender_id?: string | null
          sender_name?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          body: string | null
          color: string | null
          created_at: string
          created_by: string | null
          id: string
          pinned: boolean
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          color?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          pinned?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          color?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          pinned?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read: boolean
          title: string
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title: string
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      planner_items: {
        Row: {
          created_at: string
          details: Json
          group_name: string | null
          id: string
          item_date: string | null
          kind: string
          link_url: string | null
          notes: string | null
          person: string | null
          sort_order: number
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          details?: Json
          group_name?: string | null
          id?: string
          item_date?: string | null
          kind: string
          link_url?: string | null
          notes?: string | null
          person?: string | null
          sort_order?: number
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          details?: Json
          group_name?: string | null
          id?: string
          item_date?: string | null
          kind?: string
          link_url?: string | null
          notes?: string | null
          person?: string | null
          sort_order?: number
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          approved: boolean
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          name: string
          phone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          approved?: boolean
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          approved?: boolean
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      reminders: {
        Row: {
          created_at: string
          done: boolean
          id: string
          kind: string
          notes: string | null
          remind_on: string
          remind_time: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          done?: boolean
          id?: string
          kind?: string
          notes?: string | null
          remind_on: string
          remind_time?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          done?: boolean
          id?: string
          kind?: string
          notes?: string | null
          remind_on?: string
          remind_time?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      shopping_items: {
        Row: {
          assigned_to: string | null
          bought: boolean
          created_at: string
          due_date: string | null
          id: string
          item_name: string
          list_name: string
          notes: string | null
          price: number | null
          shop_name: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          bought?: boolean
          created_at?: string
          due_date?: string | null
          id?: string
          item_name: string
          list_name?: string
          notes?: string | null
          price?: number | null
          shop_name?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          bought?: boolean
          created_at?: string
          due_date?: string | null
          id?: string
          item_name?: string
          list_name?: string
          notes?: string | null
          price?: number | null
          shop_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string
          created_by: string | null
          due_date: string | null
          event_id: string | null
          id: string
          notes: string | null
          priority: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          event_id?: string | null
          id?: string
          notes?: string | null
          priority?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          event_id?: string | null
          id?: string
          notes?: string | null
          priority?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          address: string | null
          advance_paid: number | null
          category: string
          created_at: string
          id: string
          name: string
          next_payment_date: string | null
          notes: string | null
          phone: string | null
          remaining_payment: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          advance_paid?: number | null
          category?: string
          created_at?: string
          id?: string
          name: string
          next_payment_date?: string | null
          notes?: string | null
          phone?: string | null
          remaining_payment?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          advance_paid?: number | null
          category?: string
          created_at?: string
          id?: string
          name?: string
          next_payment_date?: string | null
          notes?: string | null
          phone?: string | null
          remaining_payment?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_family: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "member"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["super_admin", "admin", "member"],
    },
  },
} as const
