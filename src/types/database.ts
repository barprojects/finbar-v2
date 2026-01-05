export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      portfolios: {
        Row: {
          account_number: string | null
          buy_fee: number | null
          created_at: string | null
          id: string
          name: string
          sell_fee: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_number?: string | null
          buy_fee?: number | null
          created_at?: string | null
          id?: string
          name: string
          sell_fee?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_number?: string | null
          buy_fee?: number | null
          created_at?: string | null
          id?: string
          name?: string
          sell_fee?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
