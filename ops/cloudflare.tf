terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "~> 3.0"
    }
  }
}

variable "cloudflare_api_token" {
  type        = string
  sensitive   = true
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

variable "zone_id" {
  default = "0bea97500cf948a52835f63406e84a48"
}

variable "domain" {
  default = "infrad.app"
}

resource "cloudflare_record" "purelymail_mx" {
  zone_id = var.zone_id
  name = "@"
  value = "mailserver.purelymail.com"
  type = "MX"
  priority = 50
}

resource "cloudflare_record" "purelymail_ownership_proof" {
  zone_id = var.zone_id
  name = "@"
  value = "purelymail_ownership_proof=b125b7af3021dc8443c8f4fa6b52c14b8c46373505b6a54fe52fa0c7bcac4be873e250da384a628165f4b0514ac40fe6de9198bd4ea3da59bcc13a14f4a1d2e8"
  type = "TXT"
}

resource "cloudflare_record" "purelymail_domainkey1" {
  zone_id = var.zone_id
  name = "purelymail1._domainkey"
  value = "key1.dkimroot.purelymail.com"
  type = "CNAME"
  proxied = false
}

resource "cloudflare_record" "purelymail_domainkey2" {
  zone_id = var.zone_id
  name = "purelymail2._domainkey"
  value = "key2.dkimroot.purelymail.com"
  type = "CNAME"
  proxied = false
}

resource "cloudflare_record" "purelymail_domainkey3" {
  zone_id = var.zone_id
  name = "purelymail3._domainkey"
  value = "key3.dkimroot.purelymail.com"
  type = "CNAME"
  proxied = false
}

resource "cloudflare_record" "purelymail_dmarc" {
  zone_id = var.zone_id
  name = "_dmarc"
  value = "dmarcroot.purelymail.com"
  type = "CNAME"
  proxied = false
}

resource "cloudflare_record" "purelymail_spf" {
  zone_id = var.zone_id
  name = "@"
  value = "v=spf1 include:_spf.purelymail.com ~all"
  type = "TXT"
}